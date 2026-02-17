<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // POST /api/checkout
    public function checkout(Request $request)
    {
        $user = $request->user();

        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Panier vide'], 400);
        }

        DB::beginTransaction();

        try {
            // total
            $total = $cartItems->sum(function ($item) {
                return (float)$item->product->price * (int)$item->quantity;
            });

            // order
            $order = Order::create([
                'user_id' => $user->id,
                'total' => $total,
                'status' => 'pending',
            ]);

            // items
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => (int)$item->quantity,
                    'price' => (float)$item->product->price,
                ]);
            }

            // vider panier
            CartItem::where('user_id', $user->id)->delete();

            // Stripe checkout session
            \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

            $items = $order->items()->with('product')->get();

            $lineItems = $items->map(function ($it) {
                return [
                    'quantity' => (int)$it->quantity,
                    'price_data' => [
                        'currency' => 'chf',
                        'unit_amount' => (int) round(((float)$it->price) * 100),
                        'product_data' => [
                            'name' => $it->product->name,
                        ],
                    ],
                ];
            })->toArray();

            $frontend = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');

            $session = \Stripe\Checkout\Session::create([
                'mode' => 'payment',
                'line_items' => $lineItems,
                'success_url' => $frontend . '/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => $frontend . '/cancel',
                'client_reference_id' => (string)$order->id,
                'metadata' => [
                    'user_id' => (string)$user->id,
                    'order_id' => (string)$order->id,
                ],
            ]);

            $order->stripe_session_id = $session->id;
            $order->save();

            DB::commit();

            return response()->json([
                'order_id' => $order->id,
                'checkout_url' => $session->url,
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Erreur commande / Stripe',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    // GET /api/orders
    public function index(Request $request)
    {
        return $request->user()
            ->orders()
            ->with('items.product')
            ->orderByDesc('id')
            ->get();
    }

    // GET /api/orders/{id}
    public function show(Request $request, $id)
    {
        return Order::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->with('items.product')
            ->firstOrFail();
    }

    // POST /api/payment/confirm
    public function confirmPayment(Request $request)
    {
        $request->validate([
            'session_id' => ['required', 'string'],
        ]);

        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
        $session = \Stripe\Checkout\Session::retrieve($request->session_id);

        if (($session->payment_status ?? null) !== 'paid') {
            return response()->json(['message' => 'Paiement non validé'], 400);
        }

        $orderId = (int)($session->client_reference_id ?? 0);

        $order = Order::where('id', $orderId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $order->status = 'paid';
        $order->paid_at = now();
        $order->stripe_session_id = $session->id;
        $order->save();

        return response()->json([
            'message' => 'Paiement confirmé ✅',
            'order' => $order->load('items.product'),
        ]);
    }
}
