locals {
  network = "${element(split("-", var.subnet), 0)}"
}

resource "google_compute_firewall" "allow-http" {
  name    = "${local.network}-allow-http"
  network = "${local.network}"
  project = "${var.project}"

  allow {
    protocol = "tcp"
    ports    = ["3000"]
  }

  target_tags   = ["api${local.network}-server"]
  source_ranges = ["0.0.0.0/0"]
}