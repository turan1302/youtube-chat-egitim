<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MessageContentsModel extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "message_contents";
    protected $primaryKey = "mgc_id";
    protected $guarded = [];

    public const CREATED_AT = "mgc_created_at";
    public const UPDATED_AT = "mgc_updated_at";
}
