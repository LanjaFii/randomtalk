<?php

namespace App\Http\Controllers;

use App\Events\MessageDelivered;
use App\Events\MessageSeen;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageStatusController extends Controller
{
    public function delivered(Request $request, Message $message)
    {
        if ($message->sender_id === $request->user()->id) {
            return response()->noContent();
        }

        if (!$message->delivered_at) {
            $message->update([
                'delivered_at' => now(),
            ]);

            broadcast(new MessageDelivered($message))->toOthers();
        }

        return response()->noContent();
    }

    public function seen(Request $request, Message $message)
    {
        if ($message->sender_id === $request->user()->id) {
            return response()->noContent();
        }

        $changed = false;

        if (!$message->delivered_at) {
            $message->delivered_at = now();
            $changed = true;
        }

        if (!$message->seen_at) {
            $message->seen_at = now();
            $changed = true;
        }

        if ($changed) {
            $message->save();
            broadcast(new MessageSeen($message))->toOthers();
        }

        return response()->noContent();
    }
}
