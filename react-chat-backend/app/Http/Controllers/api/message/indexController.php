<?php

namespace App\Http\Controllers\api\message;

use App\Http\Controllers\api\BaseController;
use App\Http\Controllers\Controller;
use App\Models\ClientModel;
use Illuminate\Http\Request;

class indexController extends BaseController
{
    public function search_receiver(Request $request)
    {
        $user = $request->user();
        $data = $request->except("_token");

        $client = ClientModel::where([
            ["id","!=",$user->id],
            ["id","=",$data['receiver_id']],
        ])->first();

        if (!$client){
            return parent::error("Kullanıcı bulunamadı",[],404);
        }
    }
}
