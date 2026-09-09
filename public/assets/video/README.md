# Problem film — drop-in slot

The home page plays an animated storyboard by default. To swap in a produced
film, put the encoded file here:

    public/assets/video/krishiqueue-problem.mp4

and an optional poster frame here:

    public/assets/img/film-poster.jpg

Nothing else needs to change. On load the page sends a HEAD request for the
MP4; if it returns a `video/*` content type the player switches from the
storyboard to the real video, keeping the same play / pause / mute / replay
controls, the same poster overlay and the same responsive container.

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
