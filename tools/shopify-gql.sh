#!/usr/bin/env bash
# Usage: shopify-gql.sh query.graphql [variables.json]  -> prints JSON response
# Gets a fresh 24h token with the proxy-injected app credentials, caches it locally.
set -euo pipefail
TOK="${XDG_CACHE_HOME:-$HOME/.cache}/snuzzo-shopify-token.json"; mkdir -p "$(dirname "$TOK")"; SHOP="ugdyvb-hx.myshopify.com"; API="2026-10"
now=$(date +%s)
if [ ! -s "$TOK" ] || [ "$(python3 -I -c "import json,sys;print(json.load(open(sys.argv[1])).get('exp',0))" "$TOK")" -lt $((now+300)) ]; then
  curl -sS -m 30 -X POST "https://$SHOP/admin/oauth/access_token" -H "Content-Type: application/x-www-form-urlencoded" --data "grant_type=client_credentials" \
   | python3 -I -c "import json,sys,time;d=json.load(sys.stdin);d['exp']=int(time.time())+d['expires_in'];json.dump(d,open(sys.argv[1],'w'))" "$TOK"
  chmod 600 "$TOK"
fi
T=$(python3 -I -c "import json,sys;print(json.load(open(sys.argv[1]))['access_token'])" "$TOK")
Q=$(python3 -I -c "import json,sys;q=open(sys.argv[1]).read();v=json.load(open(sys.argv[2])) if len(sys.argv)>2 else {};print(json.dumps({'query':q,'variables':v}))" "$@")
curl -sS -m 60 -X POST "https://$SHOP/admin/api/$API/graphql.json" -H "Content-Type: application/json" -H "X-Shopify-Access-Token: $T" --data "$Q"
