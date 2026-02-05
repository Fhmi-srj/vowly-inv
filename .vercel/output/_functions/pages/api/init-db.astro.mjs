import { i as initializeTables } from '../../chunks/db_DAiex9Tg.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async () => {
  try {
    await initializeTables();
    return new Response(JSON.stringify({ success: true, message: "Database initialized successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
