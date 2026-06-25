<!DOCTYPE html>
<html>
<head>
    <title>Restablecer Contraseña</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333333;">Restablecimiento de Contraseña</h2>
        <p style="color: #666666;">Hola,</p>
        <p style="color: #666666;">Recibimos una solicitud para restablecer la contraseña de tu cuenta en Uconnect. Si no hiciste esta solicitud, puedes ignorar este correo.</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ env('APP_URL_FRONTEND', 'http://localhost:4200') }}/reset-password?token={{ $token }}&email={{ urlencode($email) }}" 
               style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">
                Restablecer mi contraseña
            </a>
        </div>
        <p style="color: #666666;">Este enlace expirará en 60 minutos.</p>
        <p style="color: #666666;">Saludos,<br>El equipo de Uconnect</p>
    </div>
</body>
</html>
