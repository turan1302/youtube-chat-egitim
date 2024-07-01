<?php

namespace App\Http\Controllers\api\auth;

use App\Http\Controllers\api\BaseController;
use App\Http\Controllers\Controller;
use App\Http\Requests\api\auth\LoginRequest;
use App\Http\Requests\api\auth\RegisterRequest;
use App\Models\ClientModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class indexController extends BaseController
{
    public function login(LoginRequest $request)
    {
        $data = $request->except("_token");

        $client = ClientModel::where("email", $data['email'])->first();

        if ($client && Hash::check($data['password'], $client->password)) {
            $token = $client->createToken('chat')->accessToken;

            return parent::success("Kullanıcı girişi başarılı", [
                "id" => $client->id,
                "name" => $client->name,
                "email" => $client->email,
                "token_type" => "Bearer",
                "access_token" => $token,
            ]);

        } else {
            return parent::error("Kullanıcı bilgileri hatalı", [], 401);
        }
    }

    public function register(RegisterRequest $request)
    {
        $data = $request->except("_token","password_confirmation");
        $data['password'] = Hash::make($data['password']);

        $create = ClientModel::create($data);

        if ($create) {
            return parent::success("Kullanıcı kayıt işlemi başarılı", [$create], 201);
        } else {
            return parent::error("Kullanıcı kayıt işleminde hata oluştu");
        }
    }

    public function profile(Request $request)
    {
        $client = $request->user();

        return parent::success("Kullanıcı bilgileri getirildi", [
            "user" => $client
        ]);
    }

    public function check(Request $request)
    {
        $client = $request->user();

        if ($client) {
            $token = $client->createToken('chat')->accessToken;

            return response()->json([
                "success" => true,
                "isLoggedIn" => true,
                "data" => [
                    "id" => $client->id,
                    "name" => $client->name,
                    "email" => $client->email,
                    "token_type" => "Bearer",
                    "access_token" => $token,
                ]
            ]);
        } else {
            return response()->json([
                "success" => false,
                "isLoggedIn" => false,
            ]);
        }
    }

    public function logout(Request $request)
    {
        $client = $request->user();
        $token = $client->token();
        $token->revoke();

        return parent::success("Kullanıcı oturumu başarıyla sonlandırıldı");
    }
}
