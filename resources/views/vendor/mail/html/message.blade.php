<x-mail::layout>
    <x-slot:header>
        <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td align="center">
                    <a href="{{ config('app.url') }}" style="display: inline-block;">
                        <div style="height: 50px"></div>
                    </a>
                </td>
            </tr>
        </table>
    </x-slot:header>

    {{-- Body --}}
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center">
                <a href="{{ config('app.url') }}" style="display: inline-block; margin-bottom: 20px;">
                    <img src="https://res.cloudinary.com/dhaorokhh/image/upload/v1757949286/logo-color_jec2yb.png"
                        alt="{{ config('app.name') }}"
                        style="max-height: 50px; width: auto; display: block; margin: 0 auto;">
                </a>
            </td>
        </tr>
    </table>

    {!! $slot !!}

    {{-- Subcopy --}}
    @isset($subcopy)
        <x-slot:subcopy>
            <x-mail::subcopy>
                {!! $subcopy !!}
            </x-mail::subcopy>
        </x-slot:subcopy>
    @endisset

    {{-- Footer --}}
    <x-slot:footer>
        <x-mail::footer>
            © {{ date('Y') }} {{ config('app.name') }}. {{ __('All rights reserved.') }}
        </x-mail::footer>
    </x-slot:footer>
</x-mail::layout>
