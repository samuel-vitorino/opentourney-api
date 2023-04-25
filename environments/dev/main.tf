locals {
  env = "dev"
}

provider "google" {
  project = "${var.project}"
}

module "api-dev-vpc" {
  source  = "../../modules/vpc"
  project = "${var.project}"
  env     = "${local.env}"
}

module "api-dev-server" {
  source  = "../../modules/api"
  project = "${var.project}"
  subnet  = "${module.api-dev-vpc.subnet}"
}

module "api-dev-firewall" {
  source  = "../../modules/firewall"
  project = "${var.project}"
  subnet  = "${module.api-dev-vpc.subnet}"
}