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
    }).catch((error) => {
        console.error('API call failed - unexpected exception');
        console.group('ERROR DETAILS');
        console.log('Error:', error);
        console.groupEnd();
        console.groupEnd();
        throw new Error(error);
    });


    if (!response.ok) {
        console.error('API call failed - status code is not 2xx');
        console.group('ERROR DETAILS');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.groupEnd();
        console.groupEnd();
        throw new Error('API call failed: non-ok status code');
    }

    console.log('SUCCESS!');
    console.groupEnd();

    return response.json();
}
