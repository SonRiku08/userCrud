<?php

namespace entity;

use Exception;
use PDO;
use PDOException;

class DataBase{
    private $host = "localhost";
    private $dbName = "meteo";
    private $username = "readOnlyUser";
    private $password = "passwordReadUser";

    protected $_connexionAppMeteo;

    public function __construct(){
        try {
            $dsn = "mysql:host=".$this->host.";dbname=".$this->dbName.";charset=utf8";
            $this->_connexionAppMeteo = new PDO($dsn,$this->username,$this->password);
            $this->_connexionAppMeteo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        catch(PDOException $e){
            echo "erreur de connexion à la base de donnée".$e->getMessage();
        }
        catch(Exception $e){
            echo "Une erreur s'est produite".$e->getMessage();
        }
    }

    public function addUser($email, $password) {
        try {
            if ($this->_connexionAppMeteo !== null) {
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $query = "INSERT INTO user (email, password_hash) VALUES (:email, :password)";
                $stmt = $this->_connexionAppMeteo->prepare($query);
                $stmt->bindParam(":email", $email);
                $stmt->bindParam(":password", $hashedPassword);
                $stmt->execute();
            } 
            else {
                $this->sendErrorResponse(500, 'Erreur : La connexion PDO est nulle.');
            }
        } catch (PDOException $e) {
            $this->sendErrorResponse(500, 'Erreur de requête à la base de données : ' . $e->getMessage());
        } 

    }
    
    public function connexionUser($email, $password) {
        try {
            if ($this->_connexionAppMeteo !== null) {
                $query = "SELECT * FROM user WHERE email = :email";
                $stmt = $this->_connexionAppMeteo->prepare($query);
                $stmt->bindParam(":email", $email);
                $stmt->execute();

                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                if (empty($user)) {
                    return false;
                } else {
                    if (password_verify($password, $user['password_hash'])) {
                        $_SESSION['user'] = $user;
                        return true;
                    } else {
                        return false;
                    }
                }
            } 
            else {
                $this->sendErrorResponse(500, 'Erreur : La connexion PDO est nulle.');
            }
        } catch (PDOException $e) {
            $this->sendErrorResponse(500, 'Erreur de requête à la base de données : ' . $e->getMessage());
        }
    }
    public function updateUser($id, $newPassword){

        try {
            if ($this->_connexionAppMeteo !== null) {
                $query = "UPDATE user SET password_hash = :password WHERE id = :id";
                $stmt = $this->_connexionAppMeteo->prepare($query);
                $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
                $stmt->bindParam(":password", $hashedPassword);
                $stmt->bindParam(":id", $id);
                $stmt->execute();
                return true; 
            } 
            else {
                $this->sendErrorResponse(500, 'Erreur : La connexion PDO est nulle.');
            }
        } catch (PDOException $e) {
            $this->sendErrorResponse(500, 'Erreur de requête à la base de données : ' . $e->getMessage());
        } 
    }
    public function deleteUser($id) {
        try {
            $query = "DELETE FROM user WHERE id = :id";
            $stmt = $this->_connexionAppMeteo->prepare($query);
            $stmt->bindParam(":id", $id);
            $stmt->execute();
            return true; 
        } catch (PDOException $e) { 
            return false;
        }
    }

    private function sendErrorResponse($status, $message) {
        http_response_code($status);
        echo json_encode(['error' => $message]);
        exit();
    }
}