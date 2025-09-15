<table class="subcopy" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td>
            @if (isset($actionText))
                Jika Anda mengalami masalah saat mengklik tombol "{{ $actionText }}", salin dan tempel URL berikut ke
                browser Anda:
                <span class="break-all">[{{ $actionUrl }}]</span>
            @endif
        </td>
    </tr>
</table>
