locals {
  network = "${element(split("-", var.subnet), 0)}"
}

resource "google_secret_manager_secret_version" "secret-version" {
  secret = "production_env"

  secret_data = "secret-data"
}

resource "google_compute_instance" "api" {
  project      = "${var.project}"
  zone         = "us-central1-a"
  name         = "${local.network}-api-instance"
  machine_type = "f1-micro"

  metadata = {
    "env" = google_secret_manager_secret_version.secret-version.secret_data
  }

  metadata_startup_script = "docker run --env-file=/run/secrets/env -p 3000:3000 gcr.io/${var.project}/opentourney-api:latest"

  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-97-lts"
    }
  }

  network_interface {
    subnetwork = "${var.subnet}"

    access_config {
    }
  }

  tags = ["${local.network}-api"]
}
