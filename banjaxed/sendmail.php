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
	$mail->Subject = 'Hello!';



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
	if(trim(!empty($_POST['business-name']))){
		$body.='<p><strong>Business Name:</strong> '.$_POST['business-name'].'</p>';
	}
	if(trim(!empty($_POST['amount-of-employees']))){
		$body.='<p><strong>Amount of Employees:</strong> '.$_POST['amount-of-employees'].'</p>';
	}


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