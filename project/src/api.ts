export async function uploadImage(formData: FormData) {
    const response = await fetch('/generate', { method: 'POST', body: formData });
    if (!response.ok) throw new Error("Ошибка сервера");
    return await response.json();
}