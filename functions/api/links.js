export async function onRequestGet(context) {
  try {
    const { env } = context;
    const { results: categories } = await env.DB.prepare("SELECT * FROM categories").all();
    const { results: links } = await env.DB.prepare("SELECT * FROM links").all();
    
    return new Response(JSON.stringify({ categories, links }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const auth = request.headers.get("Authorization");
    const adminPassword = env.ADMIN_PASSWORD || "admin123";
    if (auth !== adminPassword) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { category_id, title, url, description, icon_url } = await request.json();
    await env.DB.prepare("INSERT INTO links (category_id, title, url, description, icon_url) VALUES (?, ?, ?, ?, ?)")
                .bind(category_id, title, url, description, icon_url)
                .run();

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

export async function onRequestPut(context) {
  try {
    const { request, env } = context;
    const auth = request.headers.get("Authorization");
    const adminPassword = env.ADMIN_PASSWORD || "admin123";
    if (auth !== adminPassword) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { link_id, category_id, title, url, description, icon_url } = await request.json();
    await env.DB.prepare("UPDATE links SET category_id = ?, title = ?, url = ?, description = ?, icon_url = ? WHERE link_id = ?")
                .bind(category_id, title, url, description, icon_url, link_id)
                .run();

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

    const { link_id } = await request.json();
    await env.DB.prepare("DELETE FROM links WHERE link_id = ?").bind(link_id).run();

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
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
