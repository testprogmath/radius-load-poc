export async function importFlinkord() {
    const { create, getOrderReturns, free } = await import('@flink/flinkord-cli');
    return { create, getOrderReturns, free };
}

// Re-export the function as part of the public API
export default importFlinkord;