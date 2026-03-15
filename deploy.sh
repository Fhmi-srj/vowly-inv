#!/bin/bash
#======================================================================
# Deploy Script for Vowly Wedding Invitation (Astro + Node.js)
# Jalankan di terminal hosting (SSH):
#   cd /home/jasaedi1/vowly.hello-inv.com && bash deploy.sh
#
# Options:
#   --fresh-db    : Reset database (hapus semua tabel & buat ulang) ⚠️ HAPUS SEMUA DATA
#   --no-build    : Skip npm install & build (jika tidak ada perubahan frontend)
#   --local       : Mode lokal (build + push ke cPanel, jalankan di PC lokal)
#
# Catatan:
#   Build assets (dist/) sudah di-commit ke Git via `git add -f dist/`.
#   Jadi npm build hanya dijalankan jika npm tersedia di server.
#   Jika tidak ada npm, build dilakukan di lokal sebelum push.
#======================================================================

set -e  # Berhenti jika ada error

# ── Warna Output ─────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ── Parse Arguments ──────────────────────────────────────────────────
FRESH_DB=false
NO_BUILD=false
LOCAL_MODE=false

for arg in "$@"; do
    case $arg in
        --fresh-db) FRESH_DB=true ;;
        --no-build) NO_BUILD=true ;;
        --local)    LOCAL_MODE=true ;;
    esac
done

# ── Helper Functions ─────────────────────────────────────────────────
step() {
    echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}▶ $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

warn() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

error() {
    echo -e "${RED}✗ $1${NC}"
}

success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# ══════════════════════════════════════════════════════════════════════
# MODE LOKAL: Build + Push ke cPanel dari PC lokal
# ══════════════════════════════════════════════════════════════════════
if [ "$LOCAL_MODE" = true ]; then
    echo -e "\n${CYAN}╔══════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║     🚀 DEPLOY VOWLY (Local → cPanel)        ║${NC}"
    echo -e "${CYAN}║     $(date '+%Y-%m-%d %H:%M:%S')                  ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════╝${NC}"

    # 1. Build project
    step "1/3 — Building project"
    if [ "$NO_BUILD" = true ]; then
        warn "Build dilewati (--no-build)"
    else
        npm run build 2>&1
        success "Build selesai"
    fi

    # 2. Git commit (force add dist/)
    step "2/3 — Committing build"
    git add -f dist/
    git add -A
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    git commit -m "deploy: $TIMESTAMP" --allow-empty
    success "Committed: $(git log --oneline -1)"

    # 3. Push to cPanel
    step "3/3 — Pushing to cPanel"
    git push cpanel main 2>&1
    success "Push ke cPanel selesai"

    echo -e "\n${GREEN}╔══════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     ✅ PUSH SELESAI!                         ║${NC}"
    echo -e "${GREEN}║                                              ║${NC}"
    echo -e "${GREEN}║  Selanjutnya jalankan di SSH hosting:        ║${NC}"
    echo -e "${GREEN}║  cd ~/vowly.hello-inv.com && bash deploy.sh  ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
    echo ""
    exit 0
fi

# ══════════════════════════════════════════════════════════════════════
# MODE SERVER: Jalankan di hosting (SSH)
# ══════════════════════════════════════════════════════════════════════

# ── Safety: Pastikan cleanup jika error ──────────────────────────────
cleanup() {
    echo -e "\n${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    error "Deploy gagal! Cek error di atas."
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}
trap cleanup ERR

echo -e "\n${CYAN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     🚀 DEPLOY VOWLY (Server)                ║${NC}"
echo -e "${CYAN}║     $(date '+%Y-%m-%d %H:%M:%S')                  ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════╝${NC}"

# ── 1. Pull Latest Code ─────────────────────────────────────────────
step "1/5 — Mengambil kode terbaru dari Git"
git fetch origin main 2>&1 || true
git reset --hard origin/main 2>&1 || git reset --hard HEAD 2>&1
success "Kode berhasil diperbarui ke $(git log --oneline -1)"

# ── 2. NPM Dependencies ─────────────────────────────────────────────
step "2/5 — Install dependencies Node.js"
if [ "$NO_BUILD" = true ]; then
    warn "NPM install dilewati (--no-build)"
else
    if command -v npm &> /dev/null; then
        npm install --production 2>&1
        success "Dependencies selesai diinstall"
    else
        warn "npm tidak ditemukan di server"
        warn "Pastikan Node.js App sudah di-setup di cPanel"
        warn "dan klik 'Run NPM Install' dari panel Node.js"
    fi
fi

# ── 3. Build (jika perlu) ────────────────────────────────────────────
step "3/5 — Cek build assets"
if [ "$NO_BUILD" = true ]; then
    warn "Build dilewati (--no-build)"
elif command -v npm &> /dev/null; then
    if [ -d "dist/server" ] && [ -f "dist/server/entry.mjs" ]; then
        success "Build assets sudah ada dari Git"
        warn "Untuk rebuild, jalankan: npm run build"
    else
        echo "Building project..."
        npm run build 2>&1
        success "Build selesai"
    fi
else
    if [ -d "dist/server" ] && [ -f "dist/server/entry.mjs" ]; then
        success "npm tidak tersedia, tapi build assets sudah ada dari Git ✓"
    else
        error "npm tidak tersedia dan build assets tidak ditemukan!"
        error "Jalankan 'bash deploy.sh --local' di PC lokal, lalu deploy ulang"
        exit 1
    fi
fi

# ── 4. Database Init ─────────────────────────────────────────────────
step "4/5 — Database"
if [ "$FRESH_DB" = true ]; then
    warn "⚠️  FRESH DATABASE — Semua data akan dihapus!"
    read -p "Yakin ingin reset database? (ketik 'yes'): " confirm
    if [ "$confirm" = "yes" ]; then
        # Hit init-db API endpoint untuk reset database
        PORT=${PORT:-4321}
        curl -s -X POST "http://localhost:$PORT/api/init-db" -H "Content-Type: application/json" -d '{"fresh":true}' 2>&1 || warn "Init DB endpoint tidak bisa diakses (app belum jalan?)"
        success "Database di-reset"
    else
        warn "Reset database dibatalkan"
    fi
else
    success "Database skip (gunakan --fresh-db untuk reset)"
fi

# ── 5. Permissions & Restart ─────────────────────────────────────────
step "5/5 — Permissions & Restart"

# Set permissions
chmod -R 755 dist/ 2>/dev/null || true
chmod 644 .env 2>/dev/null || true

success "Permissions diperbarui"

# Cek apakah ada .htaccess
if [ ! -f ".htaccess" ]; then
    warn "Tidak ada .htaccess (Node.js app biasanya tidak perlu)"
fi

# Restart via cPanel Node.js (manual)
warn "Jangan lupa klik RESTART di cPanel → Setup Node.js App"

# ── Summary ──────────────────────────────────────────────────────────
echo -e "\n${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     ✅ DEPLOY SELESAI!                       ║${NC}"
echo -e "${GREEN}║     Commit : $(git log --oneline -1 | head -c 40)${NC}"
echo -e "${GREEN}║     Waktu  : $(date '+%H:%M:%S')                       ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  🔗 https://vowly.hello-inv.com              ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
