export async function subscribeToNewsletter({
  email,
  firstName,
  lastName,
  country,
}: {
  email: string;
  firstName?: string;
  lastName?: string;
  country?: string;
}): Promise<boolean> {
  const formData = new FormData();

  formData.append('EMAIL', email);
  if (firstName) formData.append('FNAME', firstName);
  if (lastName) formData.append('LNAME', lastName);
  if (country) formData.append('MMERGE7', country);

  // Mailchimp hidden fields from your form
  formData.append('u', '3b4e88384cbe530945e9a9cfd');
  formData.append('id', '835cafe901');
  formData.append('f_id', '0070cce0f0');

  try {
    await fetch(
      'https://gmail.us1.list-manage.com/subscribe/post?u=3b4e88384cbe530945e9a9cfd&id=835cafe901&f_id=0070cce0f0',
      {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      }
    );
    return true;
  } catch (error) {
    console.error('🧨 Failed to subscribe to newsletter:', error);
    return false;
  }
}