locals {
  network = "${element(split("-", var.subnet), 0)}"
}

data "google_secret_manager_secret_version" "secret-version" {
  secret = "projects/${var.project}/secrets/${local.network}_env"
}

data "google_container_registry_image" "api-image" {
  name = "opentourney-api"
}

data "google_compute_address" "static-ip-address" {
  name = "opentourney-${local.network}"
  region = "us-central1"
}

resource "google_compute_instance" "api" {
  project      = "${var.project}"
  zone         = "us-central1-a"
  name         = "${local.network}-server-instance"
  machine_type = "f1-micro"

  metadata_startup_script = "sudo mkdir /var/envs && echo '${data.google_secret_manager_secret_version.secret-version.secret_data}' | sudo tee /var/envs/.env && docker run --env-file=/var/envs/.env -p 3000:3000 ${data.google_container_registry_image.api-image.image_url}"

  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-97-lts"
    }
  }

  network_interface {
    subnetwork = "${var.subnet}"

    access_config {
      nat_ip = "${data.google_compute_address.static-ip-address.address}"
    }
  }

  tags = ["api${local.network}-server"]
}
