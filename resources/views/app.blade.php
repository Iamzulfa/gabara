<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Gabara') }}</title>
    <link rel="icon" href="favicon.png">

    <!-- SEO -->
    <meta name="description" content="Garasi Belajar Banjarnegera: Kesempatan Baru untuk Terus Belajar Tanpa Batas. Sekolah boleh tertunda, tapi mimpi jangan berhenti. Gabara hadir agar kamu bisa belajar lagi dengan cara yang lebih mudah." />
    <meta name="keywords" content="Garasi Belajar, Garasi Belajar Banjarnegera, Garasi Belajar Tanpa Batas, Beljar Non Formal" />
    <meta name="author" content="Garasi Belajar" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://garasibelajar.com/" />

    <meta property="og:title" content="Garasi Belajar Banjarnegara - Belajar Tanpa Batas" />
    <meta property="og:description" content="Kesempatan baru untuk terus belajar tanpa batas. Gabara hadir agar kamu bisa belajar lagi dengan cara yang lebih mudah." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://garasibelajar.com/" />
    <meta property="og:image" content="https://garasibelajar.com/images/og-image.jpg" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Garasi Belajar Banjarnegara - Belajar Tanpa Batas" />
    <meta name="twitter:description" content="Kesempatan baru untuk terus belajar tanpa batas bersama Gabara." />
    <meta name="twitter:image" content="https://garasibelajar.com/images/og-image.jpg" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body>
    @inertia
</body>

</html>
