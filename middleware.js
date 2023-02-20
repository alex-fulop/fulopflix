export function middleware(req, ev) {
    console.log(req, ev)
    return new Response('Hello world');
}