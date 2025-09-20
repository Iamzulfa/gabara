<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialController extends Controller
{
    public function destroy($id)
    {
        $material = Material::findOrFail($id);
        $material->delete();

        return redirect()->back()->with('success', 'Berkas berhasil dihapus.');
    }
}
