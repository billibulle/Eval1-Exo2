$(document).ready(function () {
    // Définition des expressions régulières pour la validation des champs
    const regEmail = /^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/i; // adresses email
    const regDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i; // dates au format jj/mm/yyyy

    // Convertir le nom en majuscules
    $('#nom').on('input', function () {
        $(this).val($(this).val().toUpperCase());
    });

    // Convertir le prénom en majuscule initiale et le reste en minuscules
    $('#prenom').on('input', function () {
        $(this).val($(this).val().charAt(0).toUpperCase() + $(this).val().slice(1).toLowerCase());
    });

    // Fonction pour vérifier la validité des champs de formulaire
    function check_form(id_input, regex, msg_vide, erreur) {
        let valid = true;
        const $input = $("#" + id_input); // Sélectionne l'élément par son ID
        const $error = $input.closest('tr').find('.form_error'); // Trouve l'élément d'erreur associé à l'entrée

        // Vérifie si l'élément existe
        if ($input.length === 0) return false;
        
        // Vérifie si le champ est vide
        if ($input.val() === "") {
            $error.text(msg_vide).fadeIn(); // Affiche le message d'erreur si le champ est vide
            valid = false;
        } else if (!regex.test($input.val())) { // Vérifie si la valeur du champ correspond à l'expression régulière
            $error.text(erreur).fadeIn();
            valid = false;
        } else {
            $error.fadeOut(); // Masque le message d'erreur si la valeur est valide
        }
        return valid;
    }

    // Met à jour le statut du champ (valide ou non) avec la couleur de bordure et l'affichage de l'erreur
    function updateFieldStatus($field, isValid, errorMessage = "") {
        const $error = $field.closest('tr').find('.form_error');
        if (isValid) {
            $field.css({ borderColor: 'green', color: 'green' }); 
            $error.fadeOut();
        } else {
            $field.css({ borderColor: 'red', color: 'red' });
            $error.text(errorMessage).fadeIn(); 
        }
    }

    // Validation en temps réel pour les champs nom et prénom
    $("#nom, #prenom").on("input", function () {
        updateFieldStatus($(this), $(this).val().length > 0, "3 caractères alphanumériques au minimum !!!!");
    });

    // Formatage et validation de la date au format jj/mm/yyyy
    $('#datepick').on("input", function () {
        let value = $(this).val().replace(/(\d{2})[\s . -](\d{2})[\s . -](\d{4})/, "$1/$2/$3");
        $(this).val(value);
        updateFieldStatus($(this), regDate.test(value), "Date au format jj/mm/yyyy");
    });

    // Validation de l'adresse email
    $('#mail').on("input", function () {
        updateFieldStatus($(this), regEmail.test($(this).val()), "Adresse mail non valide");
    });

    // Validation du code avec le format spécifique
    $('#code').on("input", function () {
        const regex = /^FR\d{5}[A-Z\-\._]{3}x$/;
        updateFieldStatus($(this), regex.test($(this).val()), "FR puis 5 chiffres puis 3 lettres majuscules et x en suffixe");
    });

    // Soumission du formulaire après validation
    $("#cwp_form").on("submit", function (e) {
        e.preventDefault(); // Empêche la soumission normale du formulaire
        let isValid = true;

        // Validation de chaque champ du formulaire
        isValid &= check_form("nom", /^[A-Za-z0-9ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ]{3,}/, "Champ obligatoire", "3 caractères alphanumériques au minimum !!!!");
        isValid &= check_form("prenom", /^[A-Za-z0-9ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ]{3,}/, "Champ obligatoire", "3 caractères alphanumériques au minimum !!!!");
        isValid &= check_form("datepick", regDate, "Champ obligatoire", "Date pas correcte");
        isValid &= check_form("mail", regEmail, "Champ obligatoire", "Adresse mail non valide");
        isValid &= check_form("code", /^FR\d{5}[A-Z\-\._]{3}x$/, "Champ obligatoire", "FR puis 5 chiffres puis 3 lettres majuscules et x en suffixe");

        // Si tous les champs sont valides, afficher un message de succès
        if (isValid) {
            Swal.fire({
                title: '<span class="custom-title">Formulaire Bancaire Soumis!</span>',
                html: 'Vos données sont valides, elles vont être transmises sur nos serveurs pour traitement. Nous sommes ravis de vous compter parmi nos nouveaux clients.',
                customClass: {
                    title: 'custom-title' // Ajoute une classe CSS personnalisée au titre du message
                }
            }).then((result) => {
                    if (result.isConfirmed) {
                        console.log("Formulaire soumis");
                        // Optionnel : Décommentez la ligne suivante si vous souhaitez réellement soumettre le formulaire
                        this.submit();
                    }
                });
        }
    });

    // Réinitialisation du formulaire (efface les messages d'erreur et réinitialise les styles)
    $("#reset").on("click", function () {
        $('.form_error').fadeOut(); // Masque tous les messages d'erreur
        $('input').css({ borderColor: '', color: '' }); // Réinitialise les styles de bordure et de texte
    });
});
