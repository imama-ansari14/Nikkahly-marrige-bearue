# Security recommendation

This system is intentionally private.

Do not remove the login just because only one person uses it. The records contain sensitive matrimonial information and photos.

For production:
- Use HTTPS.
- Use a long random JWT_SECRET.
- Use a strong admin password.
- Keep `.env` out of Git.
- Restrict MongoDB Atlas Network Access appropriately.
- Keep regular database backups/export copies.
- Do not share the admin credentials.
