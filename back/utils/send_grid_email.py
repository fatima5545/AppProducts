import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

def envoyer_email_sendgrid(sender_email, recipient_email, subject, message_body):
    """
    Fonction pour envoyer un email via SendGrid.

    Paramètres:
    - sender_email (str): L'adresse email de l'expéditeur.
    - recipient_email (str): L'adresse email du destinataire.
    - subject (str): L'objet de l'email.
    - message_body (str): Le contenu de l'email.

    Lève une exception si l'envoi de l'email échoue.

    Exemples:
    envoyer_email_sendgrid('expediteur@example.com', 'destinataire@example.com', 'Sujet de test', 'Ceci est un test.')
    """
    try:
        # Créez l'objet email avec les détails nécessaires
        message = Mail(
            from_email=sender_email,
            to_emails=recipient_email,
            subject=subject,
            plain_text_content=message_body,
        )

        # Obtenez la clé API depuis les variables d'environnement
        sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
        if not sendgrid_api_key:
            raise ValueError("La clé API SendGrid n'est pas définie dans le fichier .env.")
        
        # Initialisez le client SendGrid
        sg = SendGridAPIClient(sendgrid_api_key)

        # Envoyez l'email
        response = sg.send(message)

        # Affichez les détails de la réponse
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.body}")
        print(f"Response Headers: {response.headers}")

        # Vérifier la réponse du serveur
        if response.status_code == 202:
            print("Email envoyé avec succès !")
        else:
            print(
                f"Échec de l'envoi de l'email. Code de statut: {response.status_code}"
            )
            print(f"Corps de la réponse: {response.body}")
            raise Exception(
                f"Failed to send email. Status code: {response.status_code}"
            )

    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email via SendGrid: {str(e)}")
        raise Exception(f"Failed to send email: {str(e)}")
