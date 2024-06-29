<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BaseController extends Controller
{
    public function success($message = "", $data = [], $status = 200)
    {
        $result = [
            "success" => true,
            "title" => "Başarılı",
            "message" => $message,
            "data" => $data
        ];

        return response()->json($result,$status);
    }

    public function error($message = "", $errorData = [], $status = 500)
    {
        $result = [
            "success" => false,
            "title" => "Hata",
            "message" => $message,
        ];

        if (!empty($errorData)){
            $result['data'] = $errorData;
        }

        return response()->json($result,$status);
    }
}
