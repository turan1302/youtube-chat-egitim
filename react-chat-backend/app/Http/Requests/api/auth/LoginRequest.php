<?php

namespace App\Http\Requests\api\auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "email" => "required|string|email|max:255",
            "password" => "required|string|min:8|max:16",
        ];
    }

    public function attributes()
    {
        return [
            "email" => "E-Mail Adresiniz",
            "password" => "Şifreniz",
        ];
    }
}
