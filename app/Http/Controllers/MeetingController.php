<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\Material;
use App\Models\Assignment;
use App\Helpers\ValidationHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class MeetingController extends Controller
{
    public function index($classId)
    {
        $meetings = Meeting::where('class_id', $classId)
            ->with(['materials', 'assignments'])
            ->get();

        return Inertia::render('Classes/Show', [
            'meetings' => $meetings,
        ]);
    }

    public function store(Request $request)
    {
        $validator = ValidationHelper::meeting($request->all());
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        return DB::transaction(function () use ($request) {
            $meeting = Meeting::create([
                'class_id' => $request->class_id,
                'title' => $request->title,
                'description' => $request->description,
            ]);

            if ($request->has('materials')) {
                foreach ($request->materials as $materialData) {
                    if (!empty($materialData['link'])) {
                        Material::create([
                            'meeting_id' => $meeting->id,
                            'link' => $materialData['link'],
                        ]);
                    }
                }
            }

            if ($request->has('assignments')) {
                foreach ($request->assignments as $assignmentData) {
                    if (!empty($assignmentData['title'])) {
                        Assignment::create([
                            'meeting_id' => $meeting->id,
                            'title' => $assignmentData['title'],
                            'description' => $assignmentData['description'],
                            'date_open' => $assignmentData['date_open'],
                            'time_open' => $assignmentData['time_open'],
                            'date_close' => $assignmentData['date_close'],
                            'time_close' => $assignmentData['time_close'],
                            'file_link' => $assignmentData['file_link'] ?? null,
                        ]);
                    }
                }
            }

            return redirect()->back()->with('success', 'Pertemuan berhasil ditambahkan.');
        });
    }

    public function update(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);
        $validator = ValidationHelper::meeting($request->all(), true, $id);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        return DB::transaction(function () use ($request, $meeting) {
            $meeting->update([
                'title' => $request->title,
                'description' => $request->description,
            ]);

            if ($request->has('materials')) {
                $materialIds = collect($request->materials)
                    ->pluck('id')
                    ->filter()
                    ->toArray();

                $meeting->materials()
                    ->whereNotIn('id', $materialIds)
                    ->delete();

                foreach ($request->materials as $materialData) {
                    if (!empty($materialData['id'])) {
                        $material = Material::find($materialData['id']);
                        if ($material) {
                            $material->update([
                                'link' => $materialData['link'],
                            ]);
                        }
                    } else {
                        if (!empty($materialData['link'])) {
                            Material::create([
                                'meeting_id' => $meeting->id,
                                'link'       => $materialData['link'],
                            ]);
                        }
                    }
                }
            }

            if ($request->has('assignments')) {
                $assignmentIds = collect($request->assignments)
                    ->pluck('id')
                    ->filter()
                    ->toArray();

                $meeting->assignments()
                    ->whereNotIn('id', $assignmentIds)
                    ->delete();

                foreach ($request->assignments as $assignmentData) {
                    if (!empty($assignmentData['id'])) {
                        $assignment = Assignment::find($assignmentData['id']);
                        if ($assignment) {
                            $assignment->update([
                                'title'       => $assignmentData['title'],
                                'description' => $assignmentData['description'],
                                'date_open'   => $assignmentData['date_open'],
                                'time_open'   => $assignmentData['time_open'],
                                'date_close'  => $assignmentData['date_close'],
                                'time_close'  => $assignmentData['time_close'],
                                'file_link'   => $assignmentData['file_link'] ?? null,
                            ]);
                        }
                    } else {
                        if (!empty($assignmentData['title'])) {
                            Assignment::create([
                                'meeting_id'  => $meeting->id,
                                'title'       => $assignmentData['title'],
                                'description' => $assignmentData['description'],
                                'date_open'   => $assignmentData['date_open'],
                                'time_open'   => $assignmentData['time_open'],
                                'date_close'  => $assignmentData['date_close'],
                                'time_close'  => $assignmentData['time_close'],
                                'file_link'   => $assignmentData['file_link'] ?? null,
                            ]);
                        }
                    }
                }
            }

            return redirect()->back()->with('success', 'Pertemuan berhasil diperbarui.');
        });
    }

    public function destroy($id)
    {
        $meeting = Meeting::findOrFail($id);
        $meeting->delete();

        return redirect()->back()->with('success', 'Pertemuan berhasil dihapus.');
    }
}
