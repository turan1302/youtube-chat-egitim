<?php

namespace App\Http\Controllers\api\message;

use App\Http\Controllers\api\BaseController;
use App\Http\Controllers\Controller;
use App\Models\ClientModel;
use App\Models\MessageContentsModel;
use App\Models\MessageModel;
use ElephantIO\Client;
use Illuminate\Http\Request;

class indexController extends BaseController
{
    public function search_receiver(Request $request)
    {
        $user = $request->user();
        $data = $request->except("_token");

        $client = ClientModel::where([
            ["id", "!=", $user->id],
            ["id", "=", $data['receiver_id']],
        ])->first();

        if (!$client) {
            return parent::error("Kullanıcı bulunamadı", [], 404);
        } else {
            // MESAJ SORGULAMA
            $message_count = MessageModel::where(function ($c) use ($user, $data) {
                $c->where("mg_sender", $user->id);
                $c->where("mg_receiver", $data['receiver_id']);
            })->orWhere(function ($c) use ($user, $data) {
                $c->where("mg_receiver", $user->id);
                $c->where("mg_sender", $data['receiver_id']);
            })->count();

            if ($message_count == 0) {
                $message_create = MessageModel::create([
                    "mg_sender" => $user->id,
                    "mg_receiver" => $data['receiver_id']
                ]);

                $message_id = $message_create->mg_id;
            } else {
                $message_get = MessageModel::where(function ($c) use ($user, $data) {
                    $c->where("mg_sender", $user->id);
                    $c->where("mg_receiver", $data['receiver_id']);
                })->orWhere(function ($c) use ($user, $data) {
                    $c->where("mg_receiver", $user->id);
                    $c->where("mg_sender", $data['receiver_id']);
                })->first();

                $message_id = $message_get->mg_id;
            }

            return parent::success("Kullanıcı getirildi", [
                "message_id" => $message_id,
                "receiver_info" => $client
            ]);
        }
    }

    public function get_messages(Request $request)
    {
        $data = $request->except("_token");

        $messages = MessageContentsModel::where([
            ["mgc_messagedId", "=", $data['mgc_messageId']]
        ])->orderBy("mgc_id", "asc")->get();

        return parent::success("Mesajlar getirildi", [
            "messages" => $messages
        ]);
    }

    public function send_message(Request $request)
    {
        $user = $request->user();
        $data = $request->except("_token");

        $message_control = MessageModel::where(function ($c) use ($user, $data) {
            $c->where("mg_sender", $user->id);
            $c->where("mg_receiver", $data['receiver_id']);
        })->orWhere(function ($c) use ($user, $data) {
            $c->where("mg_receiver", $user->id);
            $c->where("mg_sender", $data['receiver_id']);
        })->first();

        if ($message_control) {
            // MESAJ GÖNDERME İŞLEMLERİ
            $result = MessageContentsModel::create([
                "mgc_messageId" => $message_control->mg_id,
                "mgc_sender" => $user->id,
                "mgc_content" => $data['message']
            ]);

            // SOCKETE MESAJ ATALIM
            $options = ["client" => Client::CLIENT_4X];
            $socket = Client::create(SOCKET_URL, $options);
            $socket->of("/");
            $socket->emit("send_message", [
                "receiver_id" => $data['receiver_id'],
                "sender_id" => $user->id,
                "message_id" => $message_control->mg_ig,
                "message" => $data['message']
            ]);
            $socket->disconnect();

            // BILDIRIM MESAJı
            $socket = Client::create(SOCKET_URL, $options);
            $socket->connect();
            $socket->of("/");
            $socket->emit("send_notification_message", [
                "receiver_id" => $data['receiver_id'],
                "sender_id" => $user->id,
                "dont_read" => MessageModel::isNotReadCount($message_control->mg_id, $data['receiver_id'])
            ]);
            $socket->disconnect();

            if ($result) {
                return parent::success("Mesaj Gönderildi");
            } else {
                return parent::error("Mesaj Gönderilme İşleminde Hata Oluştu");
            }
        } else {
            return parent::error("Sohbet Bulunamadı");
        }
    }

    public function update_read(Request $request)
    {
        $data = $request->except("_token");

        $result = MessageContentsModel::where([
            ["mgc_messageId","=",$data['mgc_messageId']],
            ["mgc_sender","!=",$data['mgc_receiver']],
        ])->update([
            "mgc_isRead" => 1
        ]);
    }
}
