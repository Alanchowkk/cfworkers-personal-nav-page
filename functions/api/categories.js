export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const auth = request.headers.get("Authorization");
    const adminPassword = env.ADMIN_PASSWORD || "admin123";
    if (auth !== adminPassword) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { name } = await request.json();
    await env.DB.prepare("INSERT INTO categories (name) VALUES (?)").bind(name).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}

export async function onRequestDelete(context) {
  try {
    const { request, env } = context;
    const auth = request.headers.get("Authorization");
    const adminPassword = env.ADMIN_PASSWORD || "admin123";
    if (auth !== adminPassword) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { category_id } = await request.json();
    
    // Delete associated links first, then delete the category
    await env.DB.prepare("DELETE FROM links WHERE category_id = ?").bind(category_id).run();
    await env.DB.prepare("DELETE FROM categories WHERE category_id = ?").bind(category_id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
