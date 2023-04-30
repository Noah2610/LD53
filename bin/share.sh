function err {
    ( >&2 echo -e "[ERROR]\n$1\nExiting." )
    exit 1
}

function msg {
    local filler="----------------------------------------"
    echo -e "${filler}\n[INFO]\n$1\n${filler}"
}

function avail {
    command -v "$1" &> /dev/null || err "Command '$1' is not available."
}

# https://stackoverflow.com/a/26966800
function kill_processes {
    local pid="$1"
    local and_self="$2"
    if children="$(pgrep -P "$pid")"; then
        for child in $children; do
            kill_processes "$child" true
        done
    fi
    [ -n "$and_self" ] && kill -9 "$pid"
}
