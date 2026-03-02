# Hellio HR — Intelligent Hiring Operations Assistant

## Background

Hellio is a professional services company that regularly interviews, evaluates, and hires technical talent (developers, DevOps engineers, SREs, data engineers). While the company's core business is highly technical, much of the hiring workflow is manual, fragmented, and inefficient.

HR professionals are required to:

- review highly technical CVs and profiles,
- manage large volumes of candidate data in inconsistent formats,
- communicate with candidates and hiring managers,
- produce reports and shortlists under time pressure.

This leads to:

- slow hiring cycles,
- suboptimal candidate matching,
- high administrative overhead,
- poor reuse of accumulated hiring knowledge.

## Your Mission

You are tasked with designing and implementing Hellio HR — an intelligent, agent-assisted system that supports and augments the hiring process while keeping humans firmly in control.

The system must help HR professionals and technical interviewers understand candidates better, faster, and act more consistently across the hiring pipeline.

## Core Capabilities

Hellio HR should support the following workflows:

### Candidate Profile & CV Management

- Present a uniform, structured view of candidates.
- Allow side-by-side viewing and diffing of multiple CV versions.
- Preserve access to original documents (PDF / Word).

### Centralized Candidate Database

- Store structured candidate data, documents, notes, and evaluations.
- Import legacy datasets (e.g. Excel sheets, document folders).
- Support querying and reporting across the candidate pool.

### Search, Reporting, and Summaries

- Enable structured queries (skills, experience, availability, location).
- Generate recruiter-friendly summaries grounded in stored data.
- Support creation of shortlists and internal reports.

### Candidate–Role Matching

- Given a job description, rank relevant candidates.
- Provide explainable reasoning for rankings.
- Support hybrid matching using both structured data and free text.

### Automated Intake & Communication (Human-in-the-Loop)

- Accept incoming CVs via documents and email.
- Normalize and enrich candidate profiles automatically.
- Draft outbound communications (e.g. rejections, requests for info).
- Require explicit human approval before any external communication.

## Design Principles

- **Assistive, not autonomous:** the system proposes, humans decide.
- **Traceable and explainable:** every recommendation must be grounded.
- **Secure by design:** candidate data is sensitive and must be protected.
- **Cost-aware:** intelligence is valuable, but not free.
- **Extensible:** new capabilities should be added via well-defined interfaces.

## Success Looks Like

A recruiter using Hellio HR can:

- understand a candidate in minutes instead of hours,
- confidently explain why someone was shortlisted or rejected,
- reuse institutional knowledge instead of starting from scratch,
- spend more time on people, less on administrative busy-work.
