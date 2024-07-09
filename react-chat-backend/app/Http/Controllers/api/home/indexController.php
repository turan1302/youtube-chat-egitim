<?php

namespace App\Http\Controllers\api\home;

use App\Http\Controllers\api\BaseController;
use App\Http\Controllers\Controller;
use App\Models\ClientModel;
use App\Models\MessageModel;
use Illuminate\Http\Request;

class indexController extends BaseController
{
    public function index(Request $request)
    {
        $client = $request->user();
        $clients = ClientModel::where("id", "!=", $client->id)->paginate(10)->through(function ($item) use ($client) {
            $item['dont_read'] = MessageModel::leftJoin("message_contents", "messages.mg_id", "=", "message_contents.mgc_messageId")->where(function ($c) use ($client) {
                $c->orWhere("messages.mg_sender", "=", $client->id);
                $c->orWhere("messages.mg_receiver", "=", $client->id);
            })->where(function ($c) use ($item) {
                $c->orWhere("message_contents.mgc_sender", $item->id);
            })->where("message_contents.mgc_isRead", "=", 0)
                ->groupBy("messages.mg_id")
                ->count();

            return $item;
        });

        return parent::success("Kullanıcılar getirildi", $clients);
    }
}
