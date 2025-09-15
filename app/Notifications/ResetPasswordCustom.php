<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordCustom extends ResetPasswordNotification
{
    /**
     * Get the reset password notification mail message.
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Permintaan Reset Kata Sandi')
            ->line('Halo, '.$notifiable->name.' 👋')
            ->line('Kami menerima permintaan untuk mereset kata sandi akun Anda.')
            ->line('Klik tombol di bawah ini untuk mengatur ulang kata sandi:')
            ->action('Reset Kata Sandi', route('password.reset', [
                'token' => $this->token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ]))
            ->line('Tautan reset kata sandi ini akan kedaluwarsa dalam ' . config('auth.passwords.' . config('auth.defaults.passwords') . '.expire') . ' menit.')
            ->line('Jika Anda tidak meminta reset kata sandi, abaikan email ini.')
            ->salutation('Hormat kami, ' . config('app.name'));
    }
}
