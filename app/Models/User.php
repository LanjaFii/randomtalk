<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        // ⚠️ PAS public_id (généré automatiquement)
        // ⚠️ PAS status (piloté par le backend)
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'last_seen' => 'datetime',
        ];
    }

    /**
     * Booted model events.
     * Génération automatique du public_id
     */
    protected static function booted(): void
    {
        static::creating(function (User $user) {
            do {
                $publicId = 'RT-' . strtoupper(Str::random(6));
            } while (self::where('public_id', $publicId)->exists());

            $user->public_id = $publicId;
        });
    }

        /**
     * Marquer l'utilisateur comme online
     */
    public function markOnline(): void
    {
        $this->forceFill([
            'status' => 'online',
            'last_seen' => now(),
        ])->saveQuietly();
    }

    /**
     * Marquer l'utilisateur comme offline
     */
    public function markOffline(): void
    {
        $this->forceFill([
            'status' => 'offline',
            'last_seen' => now(),
        ])->saveQuietly();
    }

    /**
     * Scope utilisateurs en ligne
     */
    public function scopeOnline($query)
    {
        return $query->where('status', 'online');
    }

    /**
     * Les conversations de l'utilisateur
     */
    public function conversationsAsUser1()
    {
        return $this->hasMany(Conversation::class, 'user1_id');
    }

    public function conversationsAsUser2()
    {
        return $this->hasMany(Conversation::class, 'user2_id');
    }

    public function conversations()
    {
        return Conversation::where(function ($q) {
            $q->where('user1_id', $this->id)
            ->orWhere('user2_id', $this->id);
        });
    }

}
