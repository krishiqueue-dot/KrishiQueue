# Problem film

`krishiqueue-problem.mp4` in this folder is the film the home page plays:
60 seconds, 1280x720, H.264, no audio track.

To replace it, overwrite that file. On load the page sends a HEAD request for
it; if the response is a `video/*` content type the player uses it, otherwise
it falls back to the in-browser animated storyboard. Nothing else needs to
change.

An optional poster frame goes at:

    public/assets/img/film-poster.jpg

Two settings live in `src/components/sections/ProblemFilm.tsx`:

- `SCENE_STARTS` — leave `null` to split the running time evenly across the six
  scenes, or give explicit second offsets if a re-cut is uneven.
- `FILM_HAS_AUDIO` — `false` for the current silent cut, which hides the mute
  control. Set it to `true` when a version with narration is dropped in.

## What the film should contain

Roughly 30–60 seconds, matching the six storyboard beats:

1. Before sunrise — the trolley is loaded in the dark.
2. The arrival — many trolleys reach the gate in the same hour.
3. The wait — a crowd with no order, no number, no estimate.
4. The uncertainty — an empty notice board, no information.
5. A different design — the same day, organised in advance.
6. Zero uncertainty — token, position, estimated time, payment.

## Guidance

- Cinematic, realistic, documentary in tone.
- An Indian procurement centre and Indian farmers, portrayed with dignity.
  Do not lean on imagery of destitution; the subject is a broken queue, not
  a broken person.
- No spoken claim that this is a government service.
- Encode H.264 MP4 (a WebM sibling is fine to add), target under ~8 MB so the
  page stays quick on a rural connection. Do not autoplay with sound.
