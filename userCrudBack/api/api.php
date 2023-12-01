<?php

use entity\DataBase;

require_once "../entity/DataBase.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: content-Type");

try{
    $requestData = json_decode(file_get_contents('php://input'), true);
    if (!isset($requestData['action'])) {
        echo json_encode(['success' => false, 'message' => 'Aucune Action spécifiée']);
        exit;
    }

    $database = new DataBase();
    $action = $requestData['action'];

    if($action === "signUp" || $action === "signIn"){
        verifEmail($requestData['email']);
        verifPassword($requestData['password']);
        
        $email = $requestData['email'];
        $password = $requestData['password'];

        if ($action === 'signIn'){
            $response = $database->connexionUser($email, $password);
            if ($response ===true){
                echo json_encode(['success' => true, 'message' => 'Connexion réussi', 'user' => $_SESSION['user']]);
            } else{
                echo json_encode(['success' => false, 'message' => 'Connexion échoué']);
            }
            exit;
        }
        elseif ($action === 'signUp'){
            $response = $database->addUser($email, $password);
            echo json_encode(['success' => true, 'message' => 'Inscription Réussi']);
            exit;
        }
    }
    elseif($requestData['action'] === "editAccount" || $requestData['action'] === "deleteAccount"){
        $id = $requestData['id'];
        
        if ($action === 'editAccount'){
            verifPassword($requestData['password']);
            $password = $requestData['password'];
            $response = $database->updateUser($id, $password);
            if ($response ===true){
                echo json_encode(['success' => true, 'message' => 'Modification réussi']);
            } else{
                echo json_encode(['success' => false, 'message' => 'Modification échoué']);
            }
            exit;
        }
        if ($action == 'deleteAccount') {
            $database->deleteUser($id);
            echo json_encode(['success' => true, 'message' => 'Suppression réussie']);
            exit;
        }
    }
}
catch(PDOException $e){
    echo "erreur de connexion à la base de donnée : ". $e->getMessage();
}
catch(Exception $e){
    echo "Une erreur s'est produite : ". $e->getMessage();
}

function verifEmail($email){
    if(!isset($email)){
        echo json_encode(['success' => false, 'message' => 'L\'adresse e-mail n\'est pas spécifiée']);
        exit;
    }

    if($email === ""){
        echo json_encode(['success' => false, 'message' => 'L\'adresse e-mail n\'est pas spécifiée']);
        exit;
    }

    $regEmail = '/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
    
    if(!preg_match($regEmail, $email)){
        echo json_encode(['success' => false, 'message' => 'L\'adresse e-mail n\'est pas valide']);
        exit;
    }
}

function verifPassword($password){
    $minPasswordLength = 8;

    if(!isset($password)){
        echo json_encode(['success' => false, 'message' => 'Le Mot de Passe n\'est pas spécifiée']);
        exit;
    }

    if($password === ""){
        echo json_encode(['success' => false, 'message' => 'Le Mot de Passe n\'est pas spécifiée']);
        exit;
    }

    if (strlen($password) < $minPasswordLength) {
        echo json_encode(['success' => false, 'message' => 'Le Mot de Passe doit avoir au moins ' . $minPasswordLength . ' caractères']);
        exit;
    }
}

?>

