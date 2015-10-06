<?php

$category = strtolower($_GET['category']);

$file = 'questions.json';
$json = file_get_contents($file);
$data = json_decode($json, true);

$random_num = mt_rand(0, 100);
echo $data[$category][$random_num];

?>