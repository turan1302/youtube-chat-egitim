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
}
