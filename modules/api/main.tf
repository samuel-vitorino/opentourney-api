locals {
  network = "${element(split("-", var.subnet), 0)}"
}

data "google_secret_manager_secret_version" "secret-version" {
  secret = "projects/${var.project}/secrets/production_env"
}

resource "google_compute_instance" "api" {
  project      = "${var.project}"
  zone         = "us-central1-a"
  name         = "${local.network}-server-instance"
  machine_type = "f1-micro"

  metadata_startup_script = "sudo mkdir /var/envs && echo '${data.google_secret_manager_secret_version.secret-version.secret_data}' | sudo tee /var/envs/.env && docker run --env-file=/var/envs/.env -p 3000:3000 gcr.io/${var.project}/opentourney-api:latest"

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

  tags = ["api${local.network}-server"]
}
