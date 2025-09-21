<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Announcement;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use App\Helpers\ValidationHelper;

class AnnouncementController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $query = Announcement::select([
            'id',
            'title',
            'thumbnail',
            'public_id',
            'content',
            'admin_id',
            'posted_at',
        ])->with([
            'admin:id,name,avatar',
        ]);

        if ($user->role !== 'admin') {
            $query->where('posted_at', '<=', now());
        }

        $announcements = $query->get();

        return Inertia::render('Admin/Announcement', [
            'announcements' => $announcements,
            'auth' => ['user' => $user],
        ]);
    }

    public function show($id)
    {
        $user = Auth::user();
        $announcement = Announcement::with([
            'admin:id,name,avatar',
        ])->findOrFail($id);

        if ($user->role !== 'admin' && $announcement->posted_at > now()) {
            abort(403, 'Pengumuman belum dipublikasikan');
        }

        return Inertia::render('Admin/AnnouncementDetail', [
            'announcement' => $announcement,
            'userRole' => $user->role,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeAction();

        $validator = ValidationHelper::announcement($request->all());
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        $validated = $validator->validated();

        try {
            DB::beginTransaction();

            if ($request->hasFile('thumbnail')) {
                $uploaded = Cloudinary::uploadApi()->upload(
                    $request->file('thumbnail')->getRealPath(),
                    ['folder' => 'images/announcements']
                );

                $validated['thumbnail'] = $uploaded['secure_url'];
                $validated['public_id'] = $uploaded['public_id'];
            }

            $validated['admin_id'] = Auth::id();
            $validated['posted_at'] = $request->posted_at ?? now();

            Announcement::create($validated);

            DB::commit();

            return redirect()
                ->route('announcements.index')
                ->with('success', 'Pengumuman berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal membuat pengumuman: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $this->authorizeAction();

        $announcement = Announcement::findOrFail($id);

        $validator = ValidationHelper::announcement($request->all(), true, $announcement->id);
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        $validated = $validator->validated();

        try {
            DB::beginTransaction();

            if ($request->hasFile('thumbnail')) {
                if (!empty($announcement->public_id)) {
                    Cloudinary::uploadApi()->destroy($announcement->public_id);
                }

                $uploaded = Cloudinary::uploadApi()->upload(
                    $request->file('thumbnail')->getRealPath(),
                    ['folder' => 'images/announcements']
                );

                $validated['thumbnail'] = $uploaded['secure_url'];
                $validated['public_id'] = $uploaded['public_id'];
            } else {
                $validated['thumbnail'] = $announcement->thumbnail;
                $validated['public_id'] = $announcement->public_id;
            }

            $validated['posted_at'] = $request->posted_at ?? $announcement->posted_at;

            $announcement->update($validated);

            DB::commit();

            return redirect()
                ->route('announcements.index')
                ->with('success', 'Pengumuman berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memperbarui pengumuman: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $this->authorizeAction();

        $announcement = Announcement::findOrFail($id);

        try {
            DB::beginTransaction();

            if (!empty($announcement->public_id)) {
                Cloudinary::uploadApi()->destroy($announcement->public_id);
            }

            $announcement->delete();

            DB::commit();

            return redirect()
                ->route('announcements.index')
                ->with('success', 'Pengumuman berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menghapus pengumuman: ' . $e->getMessage());
        }
    }

    private function authorizeAction()
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Akses tidak diizinkan');
        }
    }
}
