<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MessageModel extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "messages";
    protected $primaryKey = "mg_id";
    protected $guarded = [];

    public const CREATED_AT = "mg_created_at";
    public const UPDATED_AT = "mg_updated_at";

    public static function isNotReadCount($message_id,$receiver_id)
    {
        $result = MessageModel::leftJoin("message_contents","messages.mg_id","=","message_contents.mgc_messageId")
            ->where(function ($c) use ($receiver_id) {
                $c->orWhere("messages.mg_sender",$receiver_id);
                $c->orWhere("messages.mg_receiver",$receiver_id);
            })
            ->where("message_contents.mgc_sender","!=",$receiver_id)
            ->where("message_contents.mgc_isRead","=",0)
            ->where("message_contents.mgc_messageId","=",$message_id)
            ->count();

        return $result;
    }
}
