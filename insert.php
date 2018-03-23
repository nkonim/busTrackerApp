<?php
        header('Access-Control-Allow-Origin: *');
        define('SERVER', 'localhost');
        define('USERNAME', 'root');
        define('PASS', '');
        define('DBNAME', 'Track');
        $dbcon = mysqli_connect(SERVER,USERNAME,PASS,DBNAME);
        if($condb)
            {
	            $lon = filter_var($_REQUEST['lon'], FILTER_SANITIZE_NUMBER_INT);
	            $lat = $_REQUEST['lat'];
                $now = date("Y-m-d H:i:s");

                $sql="INSERT INTO gps_update(now, lon, lat) VALUES ('$now','$lon','$lat')";
                $ins=mysqli_query($dbcon, $sql);
                echo json_encode(array('message' => 'Logged'));
            }
?>