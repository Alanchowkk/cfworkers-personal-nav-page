export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { password } = await request.json();
    const adminPassword = env.ADMIN_PASSWORD || "admin123";

    if (password === adminPassword) {
      return new Response(JSON.stringify({ success: true, token: password }), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: "密码错误" }), {
        status: 401,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
