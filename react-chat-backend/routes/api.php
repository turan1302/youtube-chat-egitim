<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix'=>'client','as'=>'client.'],function (){
    Route::post('login',[\App\Http\Controllers\api\auth\indexController::class,'login'])->name('login');
    Route::post('register',[\App\Http\Controllers\api\auth\indexController::class,'register'])->name('register');

    Route::group(['middleware'=>'auth:api_client'],function (){
        Route::get('check',[\App\Http\Controllers\api\auth\indexController::class,'check'])->name('check');
        Route::get('profile',[\App\Http\Controllers\api\auth\indexController::class,'profile'])->name('profile');
        Route::get('logout',[\App\Http\Controllers\api\auth\indexController::class,'logout'])->name('logout');
    });
});

Route::group(['prefix'=>'home','as'=>'home.','middleware'=>'auth:api_client'],function (){
    Route::get('',[\App\Http\Controllers\api\home\indexController::class,'index'])->name('index');
});

Route::group(['prefix'=>'message','as'=>'message.','middleware'=>'auth:api_client'],function (){
    Route::post('search-receiver',[\App\Http\Controllers\api\message\indexController::class,'search_receiver'])->name('search_receiver');
    Route::get('get-messages',[\App\Http\Controllers\api\message\indexController::class,'get_messages'])->name('get_messages');
    Route::post('send-message',[\App\Http\Controllers\api\message\indexController::class,'send_message'])->name('send_message');
    Route::post('update-read',[\App\Http\Controllers\api\message\indexController::class,'update_read'])->name('update_read');
});
