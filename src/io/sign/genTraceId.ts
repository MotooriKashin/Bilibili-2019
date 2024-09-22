export function genTraceId() {
    const random_id = crypto.randomUUID().split('-').join('');
    return `${random_id}:${random_id.slice(-16)}:0:0`;
}