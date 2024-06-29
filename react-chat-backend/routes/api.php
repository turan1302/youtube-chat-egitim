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
