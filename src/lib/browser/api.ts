export async function callApi<T>(url: string, method: string, body?: unknown): Promise<T> {
    console.group('API CALL');
    console.log('URL:', url);
    console.log('Method:', method);

    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        console.error('API call failed');
        console.group('ERROR DETAILS');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.groupEnd();
        console.groupEnd();
        throw new Error('API call failed');
    }

    console.log('SUCCESS!');
    console.groupEnd();

    return response.json();
}
