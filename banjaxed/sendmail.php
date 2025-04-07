<?php
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';

	$mail = new PHPMailer(true);
	$mail->CharSet = 'UTF-8';
	$mail->setLanguage('ru', 'phpmailer/language/');
	$mail->IsHTML(true);

	//От кого письмо
	$mail->setFrom('levinaviktoria001@gmail.com', 'Benjaxed form');
	//Кому отправить
	$mail->addAddress('levvik8@gmail.com');
	//Тема письма
	$mail->Subject = 'Hello!"';



	//Тело письма
	$body = '<h1>Data form</h1>';
	
	if(trim(!empty($_POST['first-name']))){
		$body.='<p><strong>First Name:</strong> '.$_POST['first-name'].'</p>';
	}
	if(trim(!empty($_POST['last-name']))){
		$body.='<p><strong>Last Name:</strong> '.$_POST['last-name'].'</p>';
	}
	if(trim(!empty($_POST['email']))){
		$body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
	}
	if(trim(!empty($_POST['phone']))){
		$body.='<p><strong>Phone number:</strong> '.$_POST['phone'].'</p>';
	}
	if(trim(!empty($_POST['businesss-name']))){
		$body.='<p><strong>Businesss Name:</strong> '.$_POST['businesss-name'].'</p>';
	}
	
	// if(trim(!empty($_POST['amount-of-employees']))){
	// 	$body.='<p><strong>Сообщение:</strong> '.$_POST['amount-of-employees'].'</p>';
	// }
	
	// //Прикрепить файл
	// if (!empty($_FILES['image']['tmp_name'])) {
	// 	//путь загрузки файла
	// 	$filePath = __DIR__ . "/files/" . $_FILES['image']['name']; 
	// 	//грузим файл
	// 	if (copy($_FILES['image']['tmp_name'], $filePath)){
	// 		$fileAttach = $filePath;
	// 		$body.='<p><strong>Фото в приложении</strong>';
	// 		$mail->addAttachment($fileAttach);
	// 	}
	// }

	$mail->Body = $body;

	//Отправляем
	if (!$mail->send()) {
		$message = 'Ошибка';
	} else {
		$message = 'Данные отправлены!';
	}

	$response = ['message' => $message];

	header('Content-type: application/json');
	echo json_encode($response);
?>